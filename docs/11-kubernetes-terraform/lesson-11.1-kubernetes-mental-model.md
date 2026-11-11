# Lesson 11.1 — Kubernetes Mental Model

**Phase:** 11 — Kubernetes and Terraform  
**Goal:** Understand why Kubernetes exists, what a cluster contains, and how Pods, Deployments, and Services work together.

## Start here: why Kubernetes comes after Docker Compose

You already understand images, containers, and the way Compose starts several services on one computer. Now imagine TaskFlow needs several API copies running across multiple machines, and one copy must be replaced when it fails.

Docker Compose describes a local multi-service application. Kubernetes coordinates workloads across a cluster. It needs to know what you want running and continually works to keep the real cluster close to that desired state.

Think of the relationship this way:

- A container is the application process environment.
- A Pod is Kubernetes' deployable wrapper around one or more closely related containers.
- A Deployment asks Kubernetes to maintain a chosen number of matching Pods.
- A Service provides a stable network name and endpoint for those Pods.
- A cluster is the environment containing the control plane and worker nodes.

Kubernetes is not required for every application. It adds complexity and should be chosen when the operational requirements justify it.


## 1. Why do teams use Kubernetes?

In Phase 3, you learned how to build an image and run a container. In Phase 4, you learned how Docker Compose can manage multiple services on one development host.

Now imagine TaskFlow is running in production and traffic grows.

You may have several application instances, multiple servers, rolling releases, health checks, and failed machines to handle. You need a system that can:

- Decide which machine should run each application workload.
- Keep the requested number of application instances running.
- Replace failed application instances.
- Give changing Pods a stable way to receive network traffic.
- Roll out new versions gradually.
- Manage configuration and persistent storage.

**Kubernetes** is a platform for managing containerized workloads and services. It provides an API and controllers that help keep the running system close to the desired configuration you declare. <https://kubernetes.io/docs/concepts/>

Kubernetes is not a replacement for Dockerfile knowledge. It manages workloads that run using a supported container runtime.

## 2. Compare Docker Compose and Kubernetes

You already know Docker Compose. Let's connect the concepts.

| Docker Compose | Kubernetes concept |
|---|---|
| Compose project | Kubernetes cluster and namespace/app resources (not an exact one-to-one match) |
| Service configuration | Workload and Service resources |
| Container | Container running inside a Pod |
| Compose network | Kubernetes Pod/service networking |
| Named volume | PersistentVolume / PersistentVolumeClaim abstraction |
| compose.yaml | Kubernetes YAML manifests |
| docker compose up | kubectl apply plus controllers creating workloads (not exactly the same operation) |

Compose is excellent for describing a local multi-service application. Kubernetes is designed to coordinate workloads across a cluster of machines and continuously reconcile their desired state.

Do not assume a Compose file can simply be renamed and used as a Kubernetes manifest. The configuration models are different.

## 3. What is a Kubernetes cluster?

A **cluster** is the group of machines and control components that together run Kubernetes.

It has two broad parts:

1. **Control plane:** manages the cluster and decides what should happen.
2. **Worker nodes:** machines where application Pods run.

Simplified view:

    Kubernetes cluster
       |
       +---- Control plane
       |       |
       |       +---- API server
       |       +---- Scheduler
       |       +---- Controllers
       |       +---- Cluster data store
       |
       +---- Worker node A
       |       |
       |       +---- Pods
       |
       +---- Worker node B
               |
               +---- Pods

A managed Kubernetes service such as Amazon EKS manages important control-plane infrastructure for you, but the customer still configures workloads, access, networking, and many operational responsibilities.

## 4. What does the control plane do?

The **control plane** is the management part of Kubernetes.

You should recognize these components:

| Component | Simple responsibility |
|---|---|
| API server | Entry point for Kubernetes API requests |
| Scheduler | Chooses an appropriate node for an unscheduled Pod |
| Controller manager | Runs controllers that compare actual state with desired state |
| etcd | Stores Kubernetes cluster data and state |

The API server is what tools such as kubectl communicate with.

The scheduler decides where a Pod can run based on resource availability, constraints, and scheduling rules.

Controllers repeatedly check whether the real cluster matches the desired configuration. If a Deployment asks for three replicas but only two exist, a controller works toward restoring the requested count.

You do not need to memorize the internals of each control-plane component. Understand their roles.

## 5. What is a node?

A **node** is a worker machine in the cluster. It may be a physical server or a virtual machine.

A node provides the environment needed to run Pods.

Common node components include:

- **kubelet:** agent that makes sure the containers described for a node are running.
- **Container runtime:** software that starts and manages containers, such as containerd.
- **Network components:** provide communication between Pods and Services.

A cluster can have one or multiple worker nodes. Production clusters often use several nodes and Availability Zones for resilience, but this increases cost and management complexity. <https://kubernetes.io/docs/concepts/architecture/>

## 6. What is a Pod?

A **Pod** is the smallest deployable unit in Kubernetes.

A Pod contains one or more containers that are scheduled together and share network and storage resources.

Most ordinary application Pods contain one main application container. A second closely related helper container may also run in the same Pod. This pattern is sometimes called a **sidecar**.

Example:

    TaskFlow API Pod
       |
       +---- API container
       |
       +---- optional helper/sidecar container

Containers inside one Pod share the same Pod IP and port space. They can talk to one another using localhost, provided they use different listening ports where needed.

A Pod is not the same as a container. The Pod is the Kubernetes unit that groups container(s) and their shared resources.

Official definition: https://kubernetes.io/docs/concepts/workloads/pods/

## 7. Why are Pods replaceable?

Pods are designed to be relatively disposable.

A Pod can be removed because:

- Its node fails.
- It is evicted due to resource pressure.
- A new version is being deployed.
- An administrator deletes it.
- A controller recreates it to match the desired state.

The replacement Pod may have a different name and IP address.

This is why you should not build an application that depends on one specific Pod IP as a permanent endpoint.

## 8. What is a Deployment?

A **Deployment** is a Kubernetes resource used to manage a set of stateless application Pods and their updates.

Suppose TaskFlow needs three API instances.

You define a Deployment with a desired replica count of three.

    Deployment: taskflow-api
       |
       | desired replicas = 3
       v
    ReplicaSet
       |
       +---- API Pod A
       +---- API Pod B
       +---- API Pod C

A **ReplicaSet** is the controller-level resource that maintains the requested number of matching Pods. The Deployment manages ReplicaSets and rollout history for updates.

If one Pod disappears, the controllers work to create a replacement.

If you change the image in the Deployment, Kubernetes can roll out a new set of Pods and gradually replace the old ones according to the rollout strategy.

The key concept is **desired state**: you declare the result you want, and Kubernetes controllers continually work toward it. <https://kubernetes.io/docs/concepts/workloads/controllers/deployment/>

## 9. What does declarative mean?

**Declarative configuration** describes the desired outcome rather than a long sequence of manual steps.

For example, you describe:

- Application image.
- Desired number of replicas.
- Container port.
- Resource requests and limits.
- Labels.

You do not manually create each Pod and keep checking it yourself.

Kubernetes controllers reconcile the actual state toward the desired state.

**Reconciliation** means repeatedly comparing what exists with what should exist, then taking action to correct a difference.

This approach is a central Kubernetes idea.

## 10. What is a Service?

Pods can be replaced and receive new IP addresses. Other applications need a stable way to reach the right Pods.

A Kubernetes **Service** provides a stable network endpoint for a selected set of Pods.

For example:

    Browser / other workload
             |
             v
      taskflow-api Service
             |
        +----+----+
        |         |
        v         v
      API Pod   API Pod
        A         B

The Service selects Pods using matching labels and provides a stable address/DNS name for clients.

A Service is not a Pod and does not run an application container. It provides network access to matching backend Pods. <https://kubernetes.io/docs/concepts/services-networking/service/>

## 11. Common Service types

| Type | Purpose |
|---|---|
| ClusterIP | Internal stable endpoint inside the cluster; common default |
| NodePort | Exposes a port on each node's network address |
| LoadBalancer | Requests an external load-balancing integration, depending on the cluster environment |

For most internal TaskFlow communication, a ClusterIP Service is suitable as the mental model.

External traffic is usually handled through an ingress/gateway or cloud load-balancing integration, covered in Lesson 11.2.

## 12. What is a namespace?

A **namespace** is a logical grouping for Kubernetes resources inside a cluster.

For example, a cluster could contain:

- dev namespace.
- staging namespace.
- production namespace.

Namespaces help organize names and apply access policies and quotas. They are not automatically a complete security boundary; access control and network policy still matter.

## 13. What is kubectl?

**kubectl** (pronounced kube-control or cube-control) is the command-line tool used to communicate with the Kubernetes API server.

Common commands:

    kubectl get nodes
    kubectl get pods
    kubectl get deployments
    kubectl get services
    kubectl describe pod POD_NAME
    kubectl logs POD_NAME

The commands mean:

- get: list or retrieve resources.
- describe: show detailed information and recent events about a resource.
- logs: view container logs in a Pod.

Replace POD_NAME with an actual Pod name. These are examples, not commands to run against a cluster that has not been created.

## 14. How this applies to TaskFlow

A future Kubernetes arrangement could contain:

- A Deployment for the web/frontend serving container.
- A Deployment for the TaskFlow API.
- A Service for the API to provide stable internal access.
- A separate database service, often managed outside the cluster for a simpler first production design.
- A public entry layer for browser traffic.

The database does not have to run inside Kubernetes. A managed RDS database is a reasonable option, with private networking from the application Pods or nodes.

Kubernetes should be introduced only if TaskFlow's operational needs justify its complexity.

## 15. Common beginner mistakes

- **Thinking a Pod is the same as a container:** a Pod groups one or more containers and shared resources.
- **Directly depending on Pod IPs:** Pods are replaceable; use a Service.
- **Creating every Pod manually:** use a Deployment for replicated stateless application workloads.
- **Thinking a Deployment is a container:** it is a desired-state controller resource.
- **Thinking a Service runs the app:** the Service provides a network endpoint to Pods.
- **Treating a namespace as strong isolation by itself:** use RBAC, network policies, and other security controls.
- **Thinking Kubernetes creates the cloud infrastructure automatically:** a cluster needs nodes, network, identity, storage and other infrastructure.

## Guided example: what happens when you ask Kubernetes to run two API copies?

Imagine you submit a Deployment manifest that asks for two TaskFlow API replicas.

1. You run `kubectl apply -f deployment.yaml`. kubectl sends the desired configuration to the Kubernetes API server.
2. The API server validates and stores the resource state.
3. The Deployment controller notices that the requested number of replicas is two and creates or updates a ReplicaSet.
4. The ReplicaSet controller creates Pods until the desired count is reached.
5. The scheduler chooses suitable worker nodes for the unscheduled Pods.
6. The kubelet on each selected node asks the container runtime to pull the image when needed and start the container.
7. A Service selects the Pods using matching labels and provides a stable network endpoint.
8. If one Pod disappears, the controllers notice that actual state differs from desired state and create a replacement.

### Why do labels and selectors matter?

A Deployment's selector must match the labels in its Pod template. A Service uses its own selector to find the Pods that should receive traffic. If the label names do not match, the Service may have no endpoints even though the Pods are running.

### How would you inspect this?

```bash
kubectl get deployments
kubectl get pods
kubectl get services
kubectl describe pod POD_NAME
kubectl logs POD_NAME
```

- `get` gives a quick list and current status.
- `describe` gives details and recent events, such as scheduling or probe failures.
- `logs` shows the application output from a container in the Pod.

The mental model to keep is: declare what should exist, let controllers create and maintain it, and use a Service rather than depending on a Pod's temporary IP address.

## 16. Knowledge checkpoint

1. Why does Kubernetes exist?
2. What is a Kubernetes cluster?
3. What is the difference between the control plane and a worker node?
4. What does the scheduler do?
5. What is a Pod?
6. Why should Pods be treated as replaceable?
7. What does a Deployment manage?
8. What is the role of a ReplicaSet?
9. What does a Service provide?
10. Why is a stable Service endpoint better than connecting directly to a Pod IP?
11. What is a namespace?
12. What does kubectl communicate with?

**Completion rule:** You should be able to explain the relationship: cluster → node → Pod → container, and how a Deployment and Service make the application manageable and reachable.

## Official references

- [Kubernetes concepts](https://kubernetes.io/docs/concepts/)
- [Cluster architecture](https://kubernetes.io/docs/concepts/architecture/)
- [Nodes](https://kubernetes.io/docs/concepts/architecture/nodes/)
- [Pods](https://kubernetes.io/docs/concepts/workloads/pods/)
- [Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/)
- [Services](https://kubernetes.io/docs/concepts/services-networking/service/)
