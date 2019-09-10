# Install Kubeflow GitHub Action

Used for installint Kubeflow on your Kubernetes cluster

```yaml
      uses: ventus-ag/vks-action@master
      with: 
        config: "https://raw.githubusercontent.com/kubeflow/kubeflow/v0.6-branch/bootstrap/config/kfctl_existing_arrikto.0.6.2.yaml"
        username: ${{ secrets.USERNAME }}
        password: ${{ secrets.PASSWORD }}
```
