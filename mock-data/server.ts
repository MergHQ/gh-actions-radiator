import express from 'express'

const app = express()

type Build = {
  name: string
  status: string
  conclusion: string | null
  head_branch: string
  repository: {
    full_name: string
  }
  created_at: string
}

let builds: Build[] = [
  {
    name: 'deploy-apps',
    status: 'completed',
    conclusion: 'success',
    head_branch: 'master',
    repository: {
      full_name: 'my-org-io/service-x',
    },
    created_at: new Date().toJSON(),
  },
]

const updateWorkflows = () => {
  builds = builds.map(b =>
    b.status === 'in_progress' && Date.now() - new Date(b.created_at).getTime() >= 20000
      ? {
          ...b,
          conclusion: Math.random() > 0.8 ? 'failure' : 'success',
          status: 'completed',
        }
      : b
  )
}

setInterval(updateWorkflows, 1000)

setInterval(() => {
  builds.push({
    name: 'deploy-apps',
    status: 'in_progress',
    conclusion: null,
    head_branch: 'master',
    repository: {
      full_name: 'my-org-io/service-x',
    },
    created_at: new Date().toJSON(),
  })
}, 30000)

app.use((_, res, next) => {
  res.set('access-control-allow-origin', '*')
  next()
})

app.get('*', (_, res) => res.json({ workflow_runs: builds }))

app.listen(3000, () => console.log('server listening on 3000'))
