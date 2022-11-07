class AddPasswordResetToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :reset_digest, :string
    add_column :users, :reset_expires_at, :datetime
  end
end
