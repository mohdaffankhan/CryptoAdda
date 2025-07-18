import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/price-chart')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/price-chart"!</div>
}
