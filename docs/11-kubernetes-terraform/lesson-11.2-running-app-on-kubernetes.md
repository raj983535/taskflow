# Lesson 11.2 — Running an App on Kubernetes

**Phase:** 11 — Kubernetes and Terraform  
**Goal:** Understand the configuration objects needed to run and expose a containerized application safely in Kubernetes.

Lesson 11.1 introduced the cluster, Pods, Deployments, and Services. This lesson connects the practical pieces required by a running application.

## 1. From image to running application

Kubernetes does not build your application from source by default. A typical flow is:

    Source code
         |
         v
    Dockerfile / image build
         |
         v
    Container registry
         |
         v
    Kubernetes Deployment
         |
         v
    Pod
         |
         v
    Container runs application

The Deployment says which image to run and how many Pod replicas are desired. The node's container runtime pulls and starts the image when required, subject to registry access and cluster configuration.

For TaskFlow, a future deployment could have separate Deployments for the web-serving layer and API.

## 2. What is a Kubernetes manifest?

A **manifest** is a YAML or JSON document that describes a Kubernetes resource.

For example, a Deployment manifest might say:

- Resource kind: Deployment.
- Name: taskflow-api.
- Desired replicas: 2.
- Container image: a specific TaskFlow API image.
- Labels and selectors.
- Container port.
- Resource requests and limits.
- Health probes.

You apply the manifest to the Kubernetes API. Controllers work to bring the cluster toward the described state.

## 3. Read a basic Deployment manifest

This is an illustrative manifest. The image reference and port must be changed to match the real application before use.

    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: taskflow-api
    spec:
      replicas: 2
      selector:
        matchLabels:
          app: taskflow-api
      template:
        metadata:
          labels:
            app: taskflow-api
        spec:
          containers:
            - name: api
              image: example-registry/taskflow-api:1.0.0
              ports:
                - containerPort: 3000
              resources:
                requests:
                  cpu: "250m"
                  memory: "256Mi"
                limits:
                  cpu: "1"
                  memory: "512Mi"

Let's understand it:

- apiVersion: which Kubernetes API version describes the resource.
- kind: the type of resource, here Deployment.
- metadata: identifying information such as name and labels.
- spec: the desired configuration.
- replicas: how many matching Pods the Deployment should maintain.
- selector: which Pod labels belong to this Deployment.
- template: the specification used to create those Pods.
- containers: the containers that should run inside each Pod.
- image: which container image to use.
- containerPort: documents the port the container listens on for this workload.
- resources: requests and limits for compute resources.

The Deployment selector must match the labels in the Pod template. If they do not match, Kubernetes cannot manage the intended Pod set correctly.

## 4. Resource requests and limits

Kubernetes uses resource settings to schedule and constrain workloads.

A **request** is the amount of a resource the scheduler uses when deciding whether a node has sufficient capacity for a Pod. It is also an important baseline for resource management.

A **limit** is the maximum amount of a resource a container may use, enforced according to the resource type.

For CPU:

- 250m means one quarter of one CPU core.
- 1 means one whole CPU core.

For memory:

- 256Mi means 256 mebibytes.
- 512Mi means 512 mebibytes.

A mebibyte is 1,048,576 bytes. Kubernetes uses resource units for scheduling and enforcement.

Requests that are too high can prevent Pods from being scheduled. Limits that are too low can throttle CPU or cause memory-limited containers to be terminated. Choose these values from measurement, not guesswork.

## 5. How does a Service connect to a Deployment?

The Deployment creates Pods with labels such as:

    app: taskflow-api

A Service can select those labels:

    apiVersion: v1
    kind: Service
    metadata:
      name: taskflow-api
    spec:
      type: ClusterIP
      selector:
        app: taskflow-api
      ports:
        - port: 3000
          targetPort: 3000

The selector chooses matching Pods.

- port is the port exposed by the Service.
- targetPort is the port on the selected Pod to which traffic is forwarded.
- ClusterIP provides an internal stable endpoint within the cluster.

Other workloads can use the Service DNS name, such as taskflow-api, inside the same namespace or its fully qualified service DNS name where needed.

## 6. Configuration with ConfigMaps

Applications need environment-specific settings.

A **ConfigMap** stores non-sensitive configuration values as key/value pairs or configuration files.

Examples:

- Log level.
- Feature flag.
- Database hostname.
- Non-secret service URL.

A ConfigMap lets you change configuration without rebuilding the container image.

Do not store passwords or private keys in a ConfigMap. It is for non-confidential data. Official docs: https://kubernetes.io/docs/concepts/configuration/configmap/

A Pod can consume ConfigMap values as environment variables or mounted files.

## 7. Secrets: confidential data

A Kubernetes **Secret** is an API object designed to hold sensitive values such as passwords, tokens, or private keys.

A Pod can receive a Secret through an environment variable or a mounted file, depending on how it is configured.

Important security note:

**Base64 is encoding, not encryption.**

Kubernetes Secret data is Base64-encoded in the API representation. By default, that does not make it confidential from anyone who can read the stored values. Cluster administrators should configure encryption at rest where required, restrict RBAC access to Secrets, and consider external secret-management systems. Avoid committing Secret manifests containing real values.

Official guidance:
- https://kubernetes.io/docs/concepts/configuration/secret/
- https://kubernetes.io/docs/concepts/security/secrets-good-practices/

A Secret is still only one part of the overall security design. The application must also avoid logging or exposing secret values after reading them.

## 8. Liveness, readiness, and startup probes

A **probe** is a health test that Kubernetes performs against a container.

There are three important types:

| Probe | What it asks | Typical action |
|---|---|---|
| Startup | Has the application finished starting? | Delays liveness/readiness checks until successful |
| Liveness | Is the container still functioning, or is it stuck? | Can cause container restart after repeated failure |
| Readiness | Can this Pod accept traffic now? | Removes the Pod from normal Service endpoints while not ready |

Imagine the TaskFlow API takes 30 seconds to load its configuration.

A startup probe can give it time to initialize. A readiness probe prevents traffic from reaching it until it is ready. A liveness probe can detect a stuck process and ask Kubernetes to restart it.

Do not make liveness depend too heavily on a temporary database outage. If every API container fails liveness whenever PostgreSQL is overloaded, Kubernetes may restart all of them and make the outage worse.

Probe design should match the application's actual failure behavior.

Official details: https://kubernetes.io/docs/concepts/workloads/pods/probes/

## 9. Storage and persistent data

Pods and containers can be replaced. Important data must not live only in an ephemeral container filesystem.

Kubernetes has a storage abstraction:

- **PersistentVolume (PV):** a storage resource available to the cluster.
- **PersistentVolumeClaim (PVC):** a request for storage by a workload.
- **StorageClass:** describes a class of storage and can enable dynamic provisioning through a storage provider.

A simplified flow:

    TaskFlow database Pod
            |
            v
       PVC request
            |
            v
       StorageClass
            |
            v
       PersistentVolume
            |
            v
    Persistent storage resource

A PVC asks for capacity and access characteristics. The cluster can bind it to a suitable PV, or a StorageClass can provision storage dynamically.

Kubernetes storage behavior depends on the storage driver and reclaim policy. Deleting a PVC can have important data-retention consequences. Never assume that a volume will always be retained. Check its lifecycle and backup policy. Official docs: https://kubernetes.io/docs/concepts/storage/persistent-volumes/

For TaskFlow, the first production design may use managed PostgreSQL outside Kubernetes (for example RDS). That often avoids operating the database's persistent storage inside the cluster.

## 10. Public traffic: Service, Ingress, and Gateway API

A ClusterIP Service is normally internal to the cluster. Public traffic needs an external routing layer.

Two terms:

- **Ingress:** a Kubernetes API resource historically used to describe HTTP/HTTPS routing rules.
- **Gateway API:** a newer, more expressive Kubernetes networking API for traffic routing.

Important current guidance: the Kubernetes project says the Ingress API is frozen and recommends Gateway API for new capabilities. Ingress is still supported, but it requires an Ingress controller; creating an Ingress object alone does not make traffic routing work.

Gateway API also requires an implementation/controller supplied by the cluster environment. Choose the API and controller supported by the actual hosting platform.

Official references:
- https://kubernetes.io/docs/concepts/services-networking/ingress/
- https://gateway-api.sigs.k8s.io/

## 11. A high-level TaskFlow arrangement

    Public browser traffic
             |
             v
       Gateway / load balancer
             |
             v
       Web Service
             |
             v
        Web Pods
      (React static files)

    Browser API request
             |
             v
       Gateway / API route
             |
             v
        API Service
             |
             v
        API Pods
             |
             | private DB connection
             v
       Managed PostgreSQL

    ConfigMap -> non-secret settings
    Secret    -> sensitive values
    PVC       -> persistent storage where required
    Probes    -> startup/readiness/liveness behavior

This is a conceptual map, not a ready-to-deploy configuration.

## 12. Common kubectl operations

Inspect nodes:

    kubectl get nodes

List Pods in the current namespace:

    kubectl get pods

List Deployments and Services:

    kubectl get deployments
    kubectl get services

Inspect one Pod:

    kubectl describe pod POD_NAME

Read a Pod container's logs:

    kubectl logs POD_NAME

Apply a manifest:

    kubectl apply -f deployment.yaml

Preview differences between local manifest and live resources:

    kubectl diff -f deployment.yaml

Inspect rollout status:

    kubectl rollout status deployment/taskflow-api

The commands assume an appropriate cluster context and namespace. They are examples, not a request to access a live cluster.

Be careful with kubectl delete and context selection. A command against production can remove real workloads. Before using a command, confirm the cluster context and namespace.

## 13. Basic troubleshooting sequence

If TaskFlow API requests fail:

1. Check whether the Deployment has the desired and available replicas.
2. Check Pod status and restart counts.
3. Use describe to inspect scheduling events and probe failures.
4. Read container logs.
5. Check whether the Pod is Ready.
6. Inspect the Service selector and its endpoints.
7. Check NetworkPolicy and cluster networking if traffic cannot reach the Pod.
8. Check ConfigMaps, Secrets, and database connectivity.
9. Check storage claims if the workload requires persistent data.

Do not edit or delete resources without understanding which controller owns them. For example, deleting a Pod managed by a Deployment typically causes the Deployment to create a replacement.

## 14. Common beginner mistakes

- **Putting one application container in one Pod is always wrong:** one main container per Pod is the normal pattern; sidecars are for tightly coupled helpers.
- **Using Pod IPs as permanent addresses:** use a Service.
- **Using ConfigMap for passwords:** use Secrets or a suitable external secret system.
- **Thinking Base64 protects Secrets:** it does not encrypt them.
- **Making liveness depend on every dependency:** that can cause restart cascades.
- **Forgetting storage lifecycle:** PVC deletion and reclaim policy can affect real data.
- **Creating an Ingress object without a controller:** routing functionality requires an implementation.
- **Assuming Kubernetes is automatically cheaper than a VM:** cluster infrastructure and operations have cost.

## 15. Knowledge checkpoint

1. What is a manifest?
2. What does a Deployment's replicas field express?
3. Why must Deployment selector labels match the Pod template labels?
4. What is the difference between a request and a resource limit?
5. What does a Service selector do?
6. How are ConfigMaps and Secrets different?
7. Why is Base64 not encryption?
8. How are startup, liveness, and readiness probes different?
9. What are a PV and PVC?
10. Why might TaskFlow use RDS instead of running PostgreSQL in a Kubernetes Pod?
11. What is the difference between Ingress and Gateway API?
12. Which kubectl commands would you use to inspect a failing API deployment?

**Completion rule:** You should be able to read a simple Deployment and Service manifest and explain how its configuration, secrets, probes, storage, and traffic routing fit together.

## Official references

- [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Services](https://kubernetes.io/docs/concepts/services-networking/service/)
- [ConfigMaps](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [Secrets](https://kubernetes.io/docs/concepts/configuration/secret/)
- [Secret good practices](https://kubernetes.io/docs/concepts/security/secrets-good-practices/)
- [Probes](https://kubernetes.io/docs/concepts/workloads/pods/probes/)
- [Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)
- [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/)
- [Gateway API](https://gateway-api.sigs.k8s.io/)
