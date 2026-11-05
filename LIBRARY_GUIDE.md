# Research library — adding documents

This update is designed for the existing `jhhwang-phys/jhhwang-phys.github.io` site.
It replaces `notes.html` and `papers.html` and adds a searchable index powered by `assets/catalog.json`.
The existing homepage (`index.html`) and other pages are left unchanged.

## Directory structure

```
notes.html
papers.html
assets/
  archive.css
  archive.js
  catalog.json
files/
  notes/
    (publicly approved PDF files)
  slides/
    (publicly approved PDF or PPTX files)
```

## Before publishing research materials

- Confirm copyright and permission to post slides, papers, collaborator notes, seminar materials, and institutional documents.
- Remove personal contact details or identifying information belonging to others.
- Check for unpublished results, private discussions, confidential data, and supervisor approval requirements.
- Prefer PDFs for online viewing; optionally keep original PPTX files too.
- Where a source is not authored solely by you, clearly attribute the authors and source.
- Large archives might benefit from GitHub Releases or an external storage link rather than growing the Git repository indefinitely.

## Add a note or slide

1. Upload the file to `files/notes/` or `files/slides/` (e.g., `files/notes/berry-phase-intro.pdf`).
2. Add an entry to `assets/catalog.json`.
3. Push the changes to `main`; GitHub Pages will publish the links.

Sample (replace with actual file details; **not** a published catalog entry):

```json
{
  "version": 1,
  "items": [
    {
      "id": "berry-phase-intro",
      "type": "note",
      "title": "Berry Phase — Introductory Notes",
      "topic": "Topology",
      "date": "2026-01-15",
      "summary": "Definitions and geometric interpretation.",
      "tags": ["Berry phase", "Geometric phase"],
      "file": "files/notes/berry-phase-intro.pdf"
    },
    {
      "id": "seminar-example",
      "type": "slide",
      "title": "Seminar Slides (Example)",
      "topic": "Condensed Matter",
      "date": "2025-11-21",
      "summary": "An example of a slide entry.",
      "tags": ["Seminar"],
      "file": "files/slides/seminar-example.pdf"
    }
  ]
}
```

Types: `note`, `slide`, `poster`, or `paper`. The Notes page displays `note` only;
the Papers & Slides page displays the other three types.

File names should use lowercase ASCII letters, digits, hyphens, and underscores. Filenames and file paths in the catalog must match exactly.

The example above is intentionally **not** present in `assets/catalog.json`; no materials are published by this patch until real files are supplied.

## Integrating without a Git client

In the GitHub web interface, open the repository, choose **Add file** > **Upload files** or **Create new file**. For nested files, GitHub allows `/` in the new file's path. Commit the added pages and assets to a branch for review or to `main` after checking the changes.

## Technical notes

- This is a static site; no Jekyll plugins or package installation are required.
- Each page reads `assets/catalog.json` and filters entries on the client.
- File links are constrained to local `files/notes` and `files/slides` paths.
- For hundreds of entries, the same structure will continue to work. For thousands of PDFs, consider pagination and external binary storage.
