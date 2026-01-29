# dev-kit

dev-kit is a project that contains the development kit for developers and vibe-coders. It provides a set of tools and workflows to help developers and vibe-coders to develop and maintain the project.

## Installation

The dev-kit agent skills can be installed using `npx skills`:

### Install All Skills (Project-level)

```bash
npx skills add tom555my/dev-kit
```

This installs skills to `.claude/skills/` in your project directory.

### Install All Skills (Global)

```bash
npx skills add tom555my/dev-kit -g
```

This installs skills to `~/.claude/skills/` and makes them available across all projects.

### List Available Skills

To see what skills are available before installing:

```bash
npx skills add tom555my/dev-kit --list
```

### Install Specific Skills

To install only specific skills:

```bash
npx skills add tom555my/dev-kit --skill dev-kit.init --skill dev-kit.ticket
```

## Tools

### Agent Workflows

- `/dev-kit.init` - Initialize the dev-kit for a new project.
- `/dev-kit.ticket` - Create easy-to-follow tickets for the AI (or humans) to work on.
- `/dev-kit.research` - Research on a topic and generate a knowledge about it.
- `/dev-kit.work` - Grab a generated ticket and work on it.
- `/dev-kit.refine` - In the progress of generating docs, AI may make mistakes, this workflow is to refine the docs.
- `/dev-kit.review` - Review the completed ticket and make sure it is good to go.
