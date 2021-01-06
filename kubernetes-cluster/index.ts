const myk8s = require("./k8s")

let cluster  = new myk8s.EksCluster("rbanka",{});

exports.kubeconfig = cluster.kubeconfig


