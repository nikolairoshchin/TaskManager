class ChangeResetSentTimeName < ActiveRecord::Migration[6.1]
  def change
    rename_column :users, :reset_sent_time, :reset_expires_at
  end
end
