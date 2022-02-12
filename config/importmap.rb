# Pin npm packages by running ./bin/importmap

pin "application", preload: true
pin "@hotwired/turbo-rails", to: "turbo.min.js", preload: true
pin "@hotwired/stimulus", to: "stimulus.min.js", preload: true
pin "@hotwired/stimulus-loading", to: "stimulus-loading.js", preload: true
pin_all_from "app/javascript/controllers", under: "controllers"
pin "trix"
pin "@rails/actiontext", to: "actiontext.js"
pin "highlight.js", to: "https://ga.jspm.io/npm:highlight.js@11.4.0/es/index.js"
pin "redaxios", to: "https://ga.jspm.io/npm:redaxios@0.4.1/dist/redaxios.js"
