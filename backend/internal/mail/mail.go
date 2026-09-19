// Package mail sends plain-text e-mail over SMTP when SMTP_URL is configured (smtp://user:pass@host:port).
package mail

import (
	"fmt"
	"net"
	"net/smtp"
	"net/url"
	"strings"
)

type SMTP struct {
	host, port, user, pass, from string
}

// New returns nil when rawURL is empty, so callers can treat "no mailer" uniformly.
func New(rawURL, from string) (*SMTP, error) {
	if rawURL == "" {
		return nil, nil
	}
	u, err := url.Parse(rawURL)
	if err != nil {
		return nil, err
	}
	host, port, err := net.SplitHostPort(u.Host)
	if err != nil {
		host, port = u.Host, "587"
	}
	pass, _ := u.User.Password()
	return &SMTP{host: host, port: port, user: u.User.Username(), pass: pass, from: from}, nil
}

func (s *SMTP) Send(to, subject, body string) error {
	msg := strings.Join([]string{
		"From: " + s.from, "To: " + to, "Subject: =?UTF-8?B?" + b64(subject) + "?=",
		"MIME-Version: 1.0", "Content-Type: text/plain; charset=UTF-8", "", body,
	}, "\r\n")
	var auth smtp.Auth
	if s.user != "" {
		auth = smtp.PlainAuth("", s.user, s.pass, s.host)
	}
	fromAddr := s.from
	if i := strings.LastIndex(fromAddr, "<"); i >= 0 {
		fromAddr = strings.Trim(fromAddr[i:], "<>")
	}
	return smtp.SendMail(net.JoinHostPort(s.host, s.port), auth, fromAddr, []string{to}, []byte(msg))
}

func b64(s string) string {
	const t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
	b := []byte(s)
	var out strings.Builder
	for i := 0; i < len(b); i += 3 {
		var n uint32
		rem := len(b) - i
		for j := 0; j < 3; j++ {
			n <<= 8
			if j < rem {
				n |= uint32(b[i+j])
			}
		}
		for j := 0; j < 4; j++ {
			if j <= rem {
				out.WriteByte(t[(n>>(18-6*uint(j)))&63])
			} else {
				out.WriteByte('=')
			}
		}
	}
	_ = fmt.Sprintf
	return out.String()
}
