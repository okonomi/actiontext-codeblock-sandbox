class CodeBlocksController < ApplicationController
  def create
    @code_block = CodeBlock.create!(code_block_params)
    render :show, status: :created
  end

  def code_block_params
    params.require(:code_block).permit(:language, :content)
  end
end
