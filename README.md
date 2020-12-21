# Pulumi EKS Sample using ComponentResource

This Sample Project showcases how to use Pulumi Component Resource model to combine multiple Resources in Single Module.

This Project contains 2 Directories:

1. **Kubernetes-cluster**: Component Resource to combine AWS VPC and AWS EKS calls.
2. **Application**: Code to create AWS ECR repository, create Docker image from src code & deploy application to previously provisined EKS cluster.

```
.
├── README.md
├── application
│   ├── Pulumi.dev.yaml
│   ├── Pulumi.yaml
│   ├── index.ts
│   ├── node_modules
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   └── tsconfig.json
└── kubernetes-cluster
    ├── Pulumi.dev.yaml
    ├── Pulumi.yaml
    ├── index.ts
    ├── k8s.ts
    ├── kubeconfig.json
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    └── tsconfig.json
```
---
## Deploy EKS Cluster

1. Initialize Pulumi Stack
```
$ pulumi stack init dev
```
2. Install node dependencies
```
$ cd kubenetes-cluster && npm install
```
3. Set AWS region to deploy EKS
```
$ pulumi config set aws:region us-east-1
```
4. Deploy cluster 
```
$ pulumi up
```
5. Once the CLuster is Deployed, you can get the Kubeconfig and verify the cluster access.
```
$ pulumi stack output kubeconfig >kubeconfig.json
$ KUBECONFIG=./kubeconfig.json kubectl get nodes
```
---

