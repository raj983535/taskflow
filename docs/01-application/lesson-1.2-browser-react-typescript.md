# Lesson 1.2 — Browser, React, and TypeScript

**Phase:** 1 — Full-stack application fundamentals  
**Lesson:** 2 of 6  
**Status:** Study material published; learner checkpoint pending  
**Scope:** Understand the browser and the project-relevant React/TypeScript concepts needed for TaskFlow. This is not an exhaustive frontend course.

## 1. Learning outcomes

By the end of this lesson, you should be able to:

- Explain what the browser does when it loads a web page.
- Distinguish HTML, CSS, and JavaScript.
- Explain what React is responsible for and why components are useful.
- Understand components, props, state, events, and re-rendering.
- Explain what TypeScript adds and what it cannot guarantee.
- Trace a TaskFlow user interaction from the browser to the backend and back.
- Recognize the frontend's security boundary.

## 2. What is the browser responsible for?

A browser such as Chrome, Edge, or Firefox is the program a user uses to access a website.

At a project level, the browser:

- Requests web resources from a server.
- Loads and displays the page.
- Executes frontend JavaScript.
- Handles user interactions such as clicks, typing, and form submission.
- Sends HTTP requests to backend APIs.
- Receives responses and updates what the user sees.
- Provides developer tools for inspecting pages, requests, console messages, and performance.

The browser is the **client** in our TaskFlow client-server architecture.

## 3. HTML, CSS, and JavaScript

These three technologies have different responsibilities:

| Technology | Main responsibility | TaskFlow example |
|---|---|---|
| HTML | Structure and meaning of page content | A form, heading, button, task list |
| CSS | Appearance and layout | Colors, spacing, responsive dashboard layout |
| JavaScript | Behavior and interaction | Handle a click, send a request, update the task list |

A useful mental model:

- HTML describes what elements are on the page.
- CSS describes how those elements should look.
- JavaScript describes how the page behaves.

React applications still use these web platform capabilities. React helps organize the interface; it does not replace the browser or the underlying web platform.

## 4. What is React, and why use it?

React is a JavaScript library for building user interfaces.

A TaskFlow dashboard may contain many parts: navigation, profile summary, task counters, filters, task cards, and forms. Writing one giant page and manually coordinating every change becomes difficult as the interface grows.

React encourages us to split the interface into **components**.

A component is a reusable piece of UI with a clear responsibility.

Illustrative TaskFlow component tree:

```text
TaskFlowApp
├── AppHeader
│   ├── Brand
│   └── UserMenu
├── DashboardPage
│   ├── WelcomePanel
│   ├── TaskSummary
│   │   ├── SummaryCard
│   │   └── SummaryCard
│   ├── TaskFilters
│   ├── TaskList
│   │   ├── TaskCard
│   │   └── TaskCard
│   └── CreateTaskForm
└── AppFooter
```

Each component owns a manageable part of the interface. Components can be reused, composed into larger screens, and maintained independently.

**Important:** React is responsible for the frontend UI. It is not the backend, the database, or the hosting provider.

## 5. Four React concepts to understand

For TaskFlow, begin with these four concepts.

### A. Components

A component describes a part of the user interface.

Examples:
- `TaskCard`
- `TaskFilters`
- `UserMenu`
- `CreateTaskForm`

A parent component can compose smaller child components. This makes the UI easier to reason about than a single oversized component.

### B. Props

Props are values passed from a parent component to a child component.

For example, a `TaskCard` might receive a task title, status, and priority from its parent `TaskList`.

Think of props as **inputs to a component**. A child should not directly change the parent's props. The parent can pass a callback when it wants the child to request an action.

### C. State

State is information a component needs to remember while the UI is running and that can change over time.

TaskFlow examples:
- Which task filter is selected.
- Whether the create-task dialog is open.
- What text the user has typed into a form.
- Which task is currently being edited.
- Whether a request is loading.

When relevant state changes, React renders the component again so the interface can reflect the new value.

**State is not permanent storage.** A browser refresh can reset in-memory UI state. Persistent tasks must be retrieved from the backend and database.

### D. Events and re-rendering

An event is an interaction or occurrence the application responds to, such as a button click or form submission.

A typical UI interaction looks like this:

```text
User clicks "Complete"
        |
        v
Frontend event handler runs
        |
        v
Application requests a status change
        |
        v
Backend validates and saves the change
        |
        v
Frontend receives the result
        |
        v
React state is updated
        |
        v
UI renders the new task status
```

A **re-render** means React evaluates the affected UI again to reflect changed data. It does not mean the whole browser page must reload.

React manages updates to the page's DOM (Document Object Model), the browser's structured representation of the page. We do not need to study React's internal rendering algorithms for this project.

## 6. Where does the data come from?

The frontend should not invent the authoritative task data.

For example, when TaskFlow opens:

1. The browser loads the frontend.
2. The frontend requests the current user's tasks from the backend API.
3. The backend checks identity and permissions.
4. The backend retrieves the tasks from PostgreSQL.
5. The backend returns a response, commonly JSON.
6. React stores the received task data in UI state and renders task cards.

When a user creates or updates a task, the frontend sends a request to the backend. The backend remains responsible for validation, authorization, and persistence.

This keeps the responsibilities clear:

| Frontend responsibility | Backend responsibility |
|---|---|
| Display the task form | Validate submitted fields authoritatively |
| Show immediate feedback | Enforce business rules |
| Keep current screen/filter state | Authenticate the user |
| Send API requests | Authorize access to the requested task |
| Display returned task data | Save and retrieve persistent data |

## 7. What is TypeScript?

TypeScript is JavaScript with a static type system.

A **type** describes what kind of value is expected. For example, a task might have a text title, a status from an allowed set, and a boolean that represents whether it is overdue.

Types help developers and tools catch certain mistakes before the application runs.

Illustrative type description:

```ts
type TaskStatus = "todo" | "in_progress" | "completed";

type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  isOverdue: boolean;
};
```

This is a documentation example, not application code that needs to be installed or run.

It communicates that:
- `id` must be a string.
- `title` must be a string.
- `status` must be one of three allowed values.
- `isOverdue` must be true or false.

### Why TypeScript is useful

- Editor autocomplete can understand the shape of data.
- Type checking catches many accidental mismatches.
- Refactoring is easier because the expected data structure is explicit.
- Developers can understand component inputs and API data contracts more clearly.

### What TypeScript does not do

TypeScript does not automatically validate real data received from a network, database, form, or external API.

Type information is primarily used during development and is removed or erased from the JavaScript output. The browser executes JavaScript, not TypeScript type declarations.

For example, an API might unexpectedly return a missing field or a value of the wrong type. A TypeScript declaration by itself cannot stop that runtime data from arriving. The application must check untrusted data when it crosses a runtime boundary.

Remember this distinction:

- **Type checking:** checks how code uses values according to declared types.
- **Runtime validation:** checks actual values while the program is running.

We will connect runtime validation to backend API design in Lesson 1.3 and Lesson 1.4.

## 8. A complete TaskFlow frontend flow

Suppose a user selects the "In progress" filter.

```text
User selects a filter
        |
        v
Browser raises an interaction event
        |
        v
React event handler runs
        |
        v
Selected-filter state changes
        |
        v
React renders the task list for that filter
```

This may be a frontend-only interaction if the data is already loaded.

Now suppose the user edits a task and clicks Save:

```text
User submits edit form
        |
        v
React handles the form event
        |
        v
Frontend sends API request
        |
        v
Backend validates + checks ownership
        |
        v
PostgreSQL saves the change
        |
        v
Backend returns the updated task
        |
        v
React updates displayed task
```

The distinction is useful: some interactions only change local UI state; others must communicate with the backend and persistent database.

## 9. Browser security boundary

Anything delivered to the browser should be considered visible to the user.

That includes:
- HTML, CSS, and JavaScript sent to the client.
- Data returned in API responses.
- Frontend configuration included in the browser bundle.

Do not put database passwords, private API keys, or server secrets in frontend code or browser-visible environment variables.

Frontend validation is useful for fast feedback, but the backend must repeat important validation and enforce access permissions. A user can modify requests or bypass UI restrictions.

## 10. Essential vocabulary

| Term | Meaning |
|---|---|
| Browser | Client application that loads and runs the web interface |
| DOM | Browser's structured representation of a page |
| Component | Reusable part of a React UI |
| Component tree | Parent-child arrangement of UI components |
| Props | Inputs passed from a parent component to a child |
| State | Changeable data used by a component while the UI runs |
| Event handler | Code that responds to an interaction or event |
| Re-render | React evaluates UI again to reflect changed data |
| Type | Description of the values a variable or object is expected to have |
| Static type checking | Checking type usage before runtime |
| Runtime validation | Checking actual values while a program runs |
| Bundle | Files prepared for delivery to the browser |
| Client-side | Work carried out in the user's browser |
| Responsive UI | Interface that adapts to different screen sizes |

## 11. Common misunderstandings

| Misunderstanding | Correct understanding |
|---|---|
| React is the entire frontend platform | React is a UI library that uses browser capabilities |
| React is the backend | React normally runs as part of the browser UI; our proposed backend is Node.js + Express |
| Props and state are the same | Props are passed in; state is managed as changing component data |
| Re-render means full page refresh | React updates the UI to reflect changed data; the whole page need not reload |
| TypeScript prevents all runtime errors | It catches certain type mistakes; it does not validate external data automatically |
| Frontend state is permanent | In-memory UI state is temporary; persistent records belong in the backend/database |
| Hiding a button secures an action | The backend must enforce authorization |

## 12. Knowledge checkpoint

Answer these without copying the explanations above:

1. What are the separate responsibilities of HTML, CSS, and JavaScript?
2. Why would TaskFlow use React components instead of one large UI component?
3. What is the difference between props and state?
4. When a user selects a task filter, why might the frontend not need to contact the backend?
5. What happens after React state changes?
6. What does TypeScript help catch, and what can it not guarantee about data received from an API?
7. Why must database credentials and private API keys stay out of browser code?

### Explanation exercise

Explain this scenario:

A TaskFlow dashboard contains 20 tasks. The user selects the "Completed" filter, then edits one task's title and saves it.

Explain which part is a local frontend interaction and which part requires backend communication. Describe where React, state, events, TypeScript, the API, and PostgreSQL fit.

## 13. Completion criteria

- [ ] Explain the browser's role in a web application.
- [ ] Distinguish HTML, CSS, and JavaScript.
- [ ] Explain why React components are useful.
- [ ] Distinguish props from state.
- [ ] Explain events and re-rendering at a project level.
- [ ] Explain what TypeScript does and what runtime validation is still needed.
- [ ] Distinguish frontend-only interactions from API-backed operations.
- [ ] Explain why browser code cannot contain server secrets.
- [ ] Complete the knowledge checkpoint and explanation exercise.

**Lesson status:** Study material published. Mark complete only after the learner's checkpoint and explanation exercise have been reviewed.
