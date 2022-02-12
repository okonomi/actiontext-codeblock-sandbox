class CodeBlock < ApplicationRecord
  include ActionText::Attachable

  def attachable_content_type
    "text/plain"
  end

  def to_trix_content_attachment_partial_path
    "code_blocks/editor"
  end
end
