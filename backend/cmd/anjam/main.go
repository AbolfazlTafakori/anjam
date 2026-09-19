// anjam — the Anjam server and its management CLI in one binary.
//
//	anjam serve                          run the HTTP server (default)
//	anjam admin reset <email> [password] [name]   grant admin role / set password (printed once)
//	anjam admin list | admin remove <email>
//	anjam registration [open|invite|closed]
//	anjam invite create [note] | invite list
//	anjam users | user disable|enable|delete <email> | user reset-link <email>
//	anjam backup [file] | anjam stats | anjam version
package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/AbolfazlTafakori/anjam/backend/internal/app"
	"github.com/AbolfazlTafakori/anjam/backend/internal/cli"
	"github.com/AbolfazlTafakori/anjam/backend/internal/config"
	"github.com/AbolfazlTafakori/anjam/backend/internal/httpapi"
	"github.com/AbolfazlTafakori/anjam/backend/internal/mail"
	"github.com/AbolfazlTafakori/anjam/backend/internal/releases"
	"github.com/AbolfazlTafakori/anjam/backend/internal/store/sqlite"
)

func main() {
	if len(os.Args) > 1 && os.Args[1] == "version" {
		fmt.Println(config.Version)
		return
	}
	cfg, err := config.Load()
	if err != nil {
		log.Fatal(err)
	}
	store, err := sqlite.Open(cfg.DBFile)
	if err != nil {
		log.Fatal(err)
	}
	defer store.Close()
	mailer, err := mail.New(cfg.SMTPURL, cfg.MailFrom)
	if err != nil {
		log.Fatal("SMTP_URL: ", err)
	}
	var m app.Mailer
	if mailer != nil {
		m = mailer
	}
	a := app.New(cfg, store, m)

	if len(os.Args) > 1 && os.Args[1] != "serve" {
		os.Exit(cli.Run(a, os.Args[1:]))
	}

	if n, _ := store.Users().CountAdmins(context.Background()); n == 0 {
		log.Println("No administrator yet — run: anjam admin reset <email>")
	}
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	addr := fmt.Sprintf("%s:%d", cfg.Bind, cfg.Port)
	log.Printf("Anjam %s on http://%s  data=%s  panel=/%s  mail=%v  web=%s", cfg.Version, addr, cfg.DataDir, cfg.AdminPath, mailer != nil, cfg.WebDir)
	if err := httpapi.Run(ctx, addr, httpapi.New(a, releases.New(cfg))); err != nil {
		log.Fatal(err)
	}
}
