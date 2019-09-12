# Install Kubeflow GitHub Action

Used for installint Kubeflow on your Kubernetes cluster.
Pre-requisites:
 - functional kubectl connected to the cluster
 - no kubeflow installed on the cluster
 - cluster should have LoadBalancers and PersistentVolumes enabled - Kubeflow uses them

This task will only generate and apply Kubeflow intallation to your cluster - it will NOT verify that Kubeflow started successfully afterwards.

```yaml
      uses: ventus-ag/vks-action@master
      with: 
        config: "https://raw.githubusercontent.com/kubeflow/kubeflow/v0.6-branch/bootstrap/config/kfctl_existing_arrikto.0.6.2.yaml"
        username: ${{ secrets.USERNAME }}
        password: ${{ secrets.PASSWORD }}
```
