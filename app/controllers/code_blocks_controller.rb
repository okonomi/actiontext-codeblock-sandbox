class CodeBlocksController < ApplicationController
  def create
    code_block = CodeBlock.create!(code_block_params)
    render json: {
      sgid: code_block.attachable_sgid,
      content: render_to_string(
        partial: code_block.to_trix_content_attachment_partial_path,
        locals: { code_block: code_block },
        formats: [:html]
      )
    }, status: :created
  end

  def code_block_params
    params.require(:code_block).permit(:language, :content)
  end
end
