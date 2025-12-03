package domain

type AccountRole string

const (
	AccountRoleUser  AccountRole = "user"
	AccountRoleAdmin AccountRole = "admin"
	AccountRoleMod   AccountRole = "mod"
)
