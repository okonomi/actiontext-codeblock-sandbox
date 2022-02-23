// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "trix"
import "@rails/actiontext"
import Trix from "trix"
import hljs from "highlight.js"
import redaxios from "redaxios"
import { unescape } from "html-escaper"

document.addEventListener('turbo:load', (event) => {
  document.querySelectorAll('pre code').forEach((el) => {
    hljs.highlightElement(el);
  });
});


let editor;

function insertCodeBlock() {
  const language = prompt("input language");
  const content = prompt("input code");

  const attachment = new Trix.Attachment({
    language: language,
    content: `<pre>${content}</pre>`
  });
  editor.insertAttachment(attachment);
}

function updateCodeBlock() {
  const trixId = prompt("trix id");
  const attachment = editor.getDocument().getAttachmentById(parseInt(trixId));

  const language = prompt("language", attachment.getAttribute("language"));
  const content = prompt("upate code", stripHTML(unescape(attachment.getContent())));

  attachment.setAttributes({
    language: language,
    content: `<pre>${content}</pre>`
  });
}

function saveCodeBlocks(cb) {
  const attachments = editor.getDocument().getAttachments();

  Promise.all(
    attachments.map((attachment) => {
      if (attachment.getAttribute("sgid")) {
        return redaxios.put(`/code_blocks/${attachment.getAttribute("sgid")}`, {
          language: attachment.getAttribute("language"),
          content: stripHTML(unescape(attachment.getContent()))
        }, {
          headers: {
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
          },
          trixId: attachment.id
        })
      } else {
        return redaxios.post("/code_blocks", {
          language: attachment.getAttribute("language"),
          content: stripHTML(unescape(attachment.getContent()))
        }, {
          headers: {
            'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
          },
          trixId: attachment.id
        })
      }
    })
  ).then((results) => {
    results.forEach((result) => {
      const attachment = editor.getDocument().getAttachmentById(result.config.trixId)
      attachment.setAttributes({
        sgid: result.data.sgid
      })
    })

    cb()
  })
}

function stripHTML(str) {
  return str.replace(/(<([^>]+)>)/gi, "").trim();
}

document.addEventListener('trix-initialize', (event) => {
  editor = event.target.editor;

  const btnInsert = document.getElementById("btn-code_block-insert");
  btnInsert.addEventListener("click", (e) => {
    e.preventDefault();
    insertCodeBlock();
  })

  const btnUpdate = document.getElementById("btn-code_block-update");
  btnUpdate.addEventListener("click", (e) => {
    e.preventDefault();
    updateCodeBlock();
  })

  const form = event.target.closest("form");
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    saveCodeBlocks(() => {
      e.target.submit();
    });
  });

  const inputTrixId = document.getElementById("code_block-trix_id");
  inputTrixId.addEventListener("blur", (e) => {
    const trixId = parseInt(e.target.value);
    if (!trixId) {
      return;
    }
    const attachment = editor.getDocument().getAttachmentById(trixId);
    document.getElementById("code_block-language").value = attachment.getAttribute("language");
    document.getElementById("code_block-content").value = stripHTML(unescape(attachment.getContent()));
  })

  const btnUpdate2 = document.getElementById("btn-code_block-update2");
  btnUpdate2.addEventListener("click", (e) => {
    e.preventDefault();

    const trixId = document.getElementById("code_block-trix_id").value;
    const language = document.getElementById("code_block-language").value;
    const content = document.getElementById("code_block-content").value;

    const attachment = editor.getDocument().getAttachmentById(parseInt(trixId));

    attachment.setAttributes({
      language: language,
      content: `<pre>${content}</pre>`
    });
  })
});

const lang = Trix.config.lang
Trix.config.toolbar = {
  getDefaultHTML: () => (
    `
    <div class="trix-button-row">
      <span class="trix-button-group trix-button-group--text-tools" data-trix-button-group="text-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-bold" data-trix-attribute="bold" data-trix-key="b" title="${lang.bold}" tabindex="-1">${lang.bold}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-italic" data-trix-attribute="italic" data-trix-key="i" title="${lang.italic}" tabindex="-1">${lang.italic}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-strike" data-trix-attribute="strike" title="${lang.strike}" tabindex="-1">${lang.strike}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-link" data-trix-attribute="href" data-trix-action="link" data-trix-key="k" title="${lang.link}" tabindex="-1">${lang.link}</button>
      </span>

      <span class="trix-button-group trix-button-group--block-tools" data-trix-button-group="block-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-heading-1" data-trix-attribute="heading1" title="${lang.heading1}" tabindex="-1">${lang.heading1}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-quote" data-trix-attribute="quote" title="${lang.quote}" tabindex="-1">${lang.quote}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-code" data-trix-attribute="code" title="${lang.code}" tabindex="-1">${lang.code}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-bullet-list" data-trix-attribute="bullet" title="${lang.bullets}" tabindex="-1">${lang.bullets}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-number-list" data-trix-attribute="number" title="${lang.numbers}" tabindex="-1">${lang.numbers}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-decrease-nesting-level" data-trix-action="decreaseNestingLevel" title="${lang.outdent}" tabindex="-1">${lang.outdent}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-increase-nesting-level" data-trix-action="increaseNestingLevel" title="${lang.indent}" tabindex="-1">${lang.indent}</button>
      </span>

      <span class="trix-button-group trix-button-group--file-tools" data-trix-button-group="file-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-attach" data-trix-action="attachFiles" title="${lang.attachFiles}" tabindex="-1">${lang.attachFiles}</button>
      </span>

      <span class="trix-button-group-spacer"></span>

      <span class="trix-button-group trix-button-group--history-tools" data-trix-button-group="history-tools">
        <button type="button" class="trix-button trix-button--icon trix-button--icon-undo" data-trix-action="undo" data-trix-key="z" title="${lang.undo}" tabindex="-1">${lang.undo}</button>
        <button type="button" class="trix-button trix-button--icon trix-button--icon-redo" data-trix-action="redo" data-trix-key="shift+z" title="${lang.redo}" tabindex="-1">${lang.redo}</button>
      </span>
    </div>

    <div class="trix-dialogs" data-trix-dialogs>
      <div class="trix-dialog trix-dialog--link" data-trix-dialog="href" data-trix-dialog-attribute="href">
        <div class="trix-dialog__link-fields">
          <input type="url" name="href" class="trix-input trix-input--dialog" placeholder="${lang.urlPlaceholder}" aria-label="${lang.url}" required data-trix-input>
          <div class="trix-button-group">
            <input type="button" class="trix-button trix-button--dialog" value="${lang.link}" data-trix-method="setAttribute">
            <input type="button" class="trix-button trix-button--dialog" value="${lang.unlink}" data-trix-method="removeAttribute">
          </div>
        </div>
      </div>
    </div>
    `
  )
}
