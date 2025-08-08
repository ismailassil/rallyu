interface TournamentEnvs {
    TOURNAMENT_PORT: number,
    TOURNAMENT_DATABASE_PATH: string,
}

export const envs: TournamentEnvs = {
    TOURNAMENT_PORT: Number(process.env.TOURNAMENT_PORT) || 3008,
    TOURNAMENT_DATABASE_PATH: process.env.TOURNAMENT_DATABASE_PATH,
}
