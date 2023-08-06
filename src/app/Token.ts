export interface Token{
    value: string,
    exp: number
}

export interface TokenServer{
    token: Token
}