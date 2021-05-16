import * as L from 'lonna'
import * as M from './util/maybe'

export type Repo = { user: string; repo: string }

export type AppState = {
  token: L.Atom<M.Maybe<string>>
  repo: L.Atom<M.Maybe<Repo>>
}

const parseRepo = M.map<string, Repo>(JSON.parse)
const serializeRepo = M.map<Repo, string>(JSON.stringify)
const saveValue = (key: string) =>
  M.fold<string, void>(
    val => window.localStorage.setItem(key, val),
    () => console.warn('Cannot add null token to local storage')
  )

export const appStore = (): AppState => {
  const token = M.fromNullable(window.localStorage.getItem('gh-token'))
  const repo = parseRepo(M.fromNullable(window.localStorage.getItem('repo')))

  const tokenA = L.atom(token)
  const repoA = L.atom(repo)

  tokenA.onChange(saveValue('gh-token'))

  repoA.pipe(L.map(serializeRepo)).onChange(saveValue('repo'))

  return {
    token: tokenA,
    repo: repoA,
  }
}
