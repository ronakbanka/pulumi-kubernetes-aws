import * as k8s from "@pulumi/kubernetes";
import * as kx from "@pulumi/kubernetesx";
import * as pulumi from "@pulumi/pulumi";
import * as awsx from "@pulumi/awsx";
import * as aws from "@pulumi/aws";

const cluster = new pulumi.StackReference("rbanka/kubernetes-cluster/dev");

const kubeconfig = cluster.getOutput("kubeconfig")

// Create a k8s provider.
const provider = new k8s.Provider("provider", {
    kubeconfig: kubeconfig,
});

const config = new pulumi.Config();
const app_value = config.require("app_value") || "abc123"

const appName = "hello-world-app";
const appLabels = { appClass: appName };
const deployment = new k8s.apps.v1.Deployment(`${appName}-dep`, {
    metadata: { labels: appLabels },
    spec: {
        replicas: 2,
        selector: { matchLabels: appLabels },
        template: {
            metadata: { labels: appLabels },
            spec: {
                containers: [{
                    name: appName,
                    image: awsx.ecr.buildAndPushImage("rbanka-repo", "./src").image(),
                    ports: [{ name: "http", containerPort: 8080 }],
                    env: [{name: "VALUE", value: `${app_value}`}]
                }],
            }
        }
    },
}, { provider: provider });

const service = new k8s.core.v1.Service(`${appName}-svc`, {
    metadata: { labels: appLabels },
    spec: {
        type: "LoadBalancer",
        ports: [{ port: 80, targetPort: "http" }],
        selector: appLabels,
    },
}, { provider: provider });

// Export the URL for the load balanced service.
export const url = service.status.loadBalancer.ingress[0].hostname;
