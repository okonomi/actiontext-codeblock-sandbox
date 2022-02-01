class CodeBlock < ApplicationRecord
  include ActionText::Attachable

  def attachable_content_type
    "text/plain"
  end
end
