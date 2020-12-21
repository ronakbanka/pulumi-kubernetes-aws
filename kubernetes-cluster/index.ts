const myk8s = require("./k8s")
import * as k8s from "@pulumi/kubernetes";

let cluster  = new myk8s.EksCluster("rbanka",{});

exports.kubeconfig = cluster.kubeconfig


