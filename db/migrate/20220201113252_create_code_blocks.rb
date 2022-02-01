class CreateCodeBlocks < ActiveRecord::Migration[7.0]
  def change
    create_table :code_blocks do |t|
      t.string :language
      t.text :content

      t.timestamps
    end
  end
end
