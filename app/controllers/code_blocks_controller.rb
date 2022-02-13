class CodeBlocksController < ApplicationController
  before_action :set_code_block, only: :update

  def create
    @code_block = CodeBlock.create!(code_block_params)
    render json: {
      sgid: @code_block.attachable_sgid,
      language: @code_block.language,
      content: render_to_string(
        partial: @code_block.to_trix_content_attachment_partial_path,
        locals: { code_block: @code_block },
        formats: [:html]
      )
    }
  end

  def update
    if @code_block.update(code_block_params)
      render json: {
        sgid: @code_block.attachable_sgid,
        language: @code_block.language,
        content: render_to_string(
          partial: @code_block.to_trix_content_attachment_partial_path,
          locals: { code_block: @code_block },
          formats: [:html]
        )
      }
    end
  end

  private

  def code_block_params
    params.require(:code_block).permit(:language, :content)
  end

  def set_code_block
    @code_block = ActionText::Attachable.from_attachable_sgid(params[:sgid])
  end
end
