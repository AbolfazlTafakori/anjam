// Package cli implements the management subcommands of the anjam binary.
package cli

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/AbolfazlTafakori/anjam/backend/internal/app"
	"github.com/AbolfazlTafakori/anjam/backend/internal/domain"
)

const usage = `usage:
  anjam serve
  anjam admin reset <email> [password] [name]   grant admin role / set password (printed once)
  anjam admin list | admin remove <email>
  anjam registration [open|invite|closed]
  anjam invite create [note] | invite list
  anjam users | user disable|enable|delete <email> | user reset-link <email>
  anjam backup [file] | anjam stats | anjam version`

func Run(a *app.App, args []string) int {
	ctx := context.Background()
	st := a.Store()
	when := func(t time.Time) string {
		if t.IsZero() {
			return "-"
		}
		return t.Format("2006-01-02 15:04")
	}
	arg := func(i int) string {
		if i < len(args) {
			return args[i]
		}
		return ""
	}
	quiet := os.Getenv("ANJAM_QUIET") != ""
	fail := func(err error) int { fmt.Fprintln(os.Stderr, "error:", err); return 1 }

	switch arg(0) + " " + arg(1) {
	case "admin reset":
		u, pw, err := a.SetAdmin(ctx, arg(2), arg(3), arg(4))
		if err != nil {
			if arg(2) == "" {
				fmt.Fprintln(os.Stderr, "usage: anjam admin reset <email> [password] [name]")
				return 1
			}
			return fail(err)
		}
		if quiet {
			fmt.Printf("%s\n%s\n", u.Email, pw)
			return 0
		}
		fmt.Printf("\n  Administrator\n  E-mail:   %s\n  Password: %s\n\n  Panel:    %s/%s\n  The same e-mail and password also sign in to the app itself.\n  (shown once; every session of this account has been signed out)\n\n", u.Email, pw, a.Config().PublicURL, a.Config().AdminPath)
	case "admin list":
		users, err := st.Users().List(ctx)
		if err != nil {
			return fail(err)
		}
		n := 0
		for _, u := range users {
			if u.Role == domain.RoleAdmin {
				fmt.Printf("%s\t%s\tsince %s\n", u.Email, u.Name, when(u.CreatedAt))
				n++
			}
		}
		if n == 0 {
			fmt.Println("(none)")
		}
	case "admin remove":
		if err := a.RemoveAdmin(ctx, arg(2)); err != nil {
			return fail(err)
		}
		fmt.Println("now an ordinary user")
	case "registration ", "registration":
		fmt.Println("registration:", a.RegistrationMode(ctx))
	case "registration open", "registration invite", "registration closed":
		if err := a.SetRegistrationMode(ctx, domain.Registration(arg(1)), "cli", ""); err != nil {
			return fail(err)
		}
		fmt.Println("registration:", arg(1))
	case "invite create":
		admin := &domain.User{ID: "cli"}
		code, err := a.CreateInvite(ctx, admin, strings.Join(args[2:], " "), "")
		if err != nil {
			return fail(err)
		}
		fmt.Println(code)
	case "invite list":
		list, err := st.Invites().List(ctx)
		if err != nil {
			return fail(err)
		}
		for _, i := range list {
			state := "free"
			if i.UsedBy != "" {
				state = "used " + when(i.UsedAt)
			}
			fmt.Printf("%s\t%s\t%s\n", i.Code, state, i.Note)
		}
		if len(list) == 0 {
			fmt.Println("(none)")
		}
	case "users ", "users":
		list, err := st.Users().List(ctx)
		if err != nil {
			return fail(err)
		}
		for _, u := range list {
			state := "active"
			if u.Disabled {
				state = "DISABLED"
			}
			if u.Role == domain.RoleAdmin {
				state += " admin"
			}
			fmt.Printf("%s\t%s\t%s\tjoined %s\tsync %s\n", u.Email, u.Name, state, when(u.CreatedAt), when(u.LastSyncAt))
		}
		if len(list) == 0 {
			fmt.Println("(none)")
		}
	case "user disable", "user enable", "user delete", "user reset-link":
		u, err := st.Users().ByEmail(ctx, arg(2))
		if err != nil {
			fmt.Println("no such user")
			return 1
		}
		admin := &domain.User{ID: "cli"}
		action := map[string]string{"disable": "disable", "enable": "enable", "delete": "delete", "reset-link": "reset_link"}[arg(1)]
		out, err := a.UserAction(ctx, admin, u.ID, action, "", "")
		if err != nil {
			return fail(err)
		}
		if link, ok := out["link"]; ok {
			fmt.Println(link)
		} else {
			fmt.Println(arg(1) + "d")
		}
	case "backup ", "backup":
		file := arg(1)
		if file == "" {
			file = filepath.Join(a.Config().DataDir, "anjam-backup-"+time.Now().Format("2006-01-02-15-04-05")+".sqlite")
		}
		if err := st.Backup(ctx, file); err != nil {
			return fail(err)
		}
		fmt.Println(file)
	case "stats ", "stats":
		users, _ := st.Users().Count(ctx)
		admins, _ := st.Users().CountAdmins(ctx)
		tasks, _, _ := st.Sync().CountAllTasks(ctx)
		fmt.Printf("{\n  \"users\": %d,\n  \"tasks\": %d,\n  \"admins\": %d,\n  \"registration\": \"%s\",\n  \"db\": %d\n}\n", users, tasks, admins, a.RegistrationMode(ctx), st.SizeBytes())
	default:
		fmt.Println(usage)
		if arg(0) != "" && arg(0) != "help" {
			return 1
		}
	}
	return 0
}
