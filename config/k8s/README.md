# Kubernetes Manifests

These manifests deploy the sample app into a local Kubernetes cluster.

## Build Local Images

The web image must be built with `/api` as the browser API path because public Next.js environment variables are baked into the client bundle at build time.

```bash
docker build -t k8s-sample-api:k8s ./api
docker build -t k8s-sample-web:k8s --build-arg NEXT_PUBLIC_API_URL=/api ./web
```

If you use `kind`, load the local images into the cluster after building:

```bash
kind load docker-image k8s-sample-api:k8s
kind load docker-image k8s-sample-web:k8s
```

Docker Desktop Kubernetes can usually use locally built Docker images directly.

For minikube with the Docker driver:

```bash
minikube image load k8s-sample-api:k8s
minikube image load k8s-sample-web:k8s
```

## Deploy

```bash
kubectl apply -k config/k8s
kubectl -n k8s-sample get all
```

## Access Locally

If your cluster has an Ingress controller, open:

```text
http://localhost
http://localhost/api/health
```

If you do not have an Ingress controller yet, port-forward the web service:

```bash
kubectl -n k8s-sample port-forward service/web 3000:3000
```

Then open `http://localhost:3000`.

The web app includes a small `/api/*` proxy route, so browser requests still reach the API while you are using this direct port-forward.

For the API directly:

```bash
kubectl -n k8s-sample port-forward service/api 3001:3001
```

Then open `http://localhost:3001/api/health`.

## Minikube Troubleshooting

If `kubectl apply` fails while downloading OpenAPI data, your minikube control plane is probably stopped or your kubeconfig points to a stale minikube port:

```bash
minikube status
minikube update-context
minikube stop
minikube start
```

If pods show `ImagePullBackOff` for `k8s-sample-api:k8s` or `k8s-sample-web:k8s`, rebuild and reload the images:

```bash
docker build -t k8s-sample-api:k8s ./api
docker build -t k8s-sample-web:k8s --build-arg NEXT_PUBLIC_API_URL=/api ./web
minikube image load k8s-sample-api:k8s
minikube image load k8s-sample-web:k8s
kubectl -n k8s-sample rollout restart deployment/api deployment/web
```

## Clean Up

```bash
kubectl delete -k config/k8s
```
