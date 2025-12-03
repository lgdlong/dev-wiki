package domain

type AccountStatus string

const (
	AccountStatusActive  AccountStatus = "active"
	AccountStatusDeleted AccountStatus = "deleted"
	AccountStatusBanned  AccountStatus = "banned"
)
