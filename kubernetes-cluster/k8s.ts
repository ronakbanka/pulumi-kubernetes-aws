"use strict";

import * as awsx from "@pulumi/awsx";
import * as eks from "@pulumi/eks";
import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export class EksCluster extends pulumi.ComponentResource {
    kubeconfig: any;
    provider: any;

    constructor(name: string, opts?: pulumi.ResourceOptions) {
        
        const clusterName = `${name}-cluster`
        const Tag = `kubernetes.io/cluster/${clusterName}`

        super("pulumi:k8s:ekscluster", clusterName, opts);

        // Creating AWS network resources
        let vpc = new awsx.ec2.Vpc(`${clusterName}-vpc`, {
            cidrBlock: "10.0.0.0/16",
            numberOfAvailabilityZones: 2,
            subnets: [
                {
                    type: "private",
                    tags: {
                        [Tag]: "owned",
                        "kubernetes.io/role/internal-elb": "1",
                    }
                },
                {
                    type: "public",
                    tags: {
                        [Tag]: "owned",
                        "kubernetes.io/role/elb": "1"
                    }
                }
            ],
            tags: {
                Name: `${clusterName}-vpc`
            }
        }, { parent: this });

        //Creating EKS cluster Resources
        let cluster = new eks.Cluster(name, {
            name: clusterName,
            vpcId: vpc.id,
            privateSubnetIds: vpc.privateSubnetIds,
            publicSubnetIds: vpc.publicSubnetIds,
            instanceType: "t2.medium",
            desiredCapacity: 2
        }, { parent: this });

        this.kubeconfig = cluster.kubeconfig;
        this.provider = cluster.provider;

        this.registerOutputs({
            kubeconfig: this.kubeconfig
        });
    }
}
