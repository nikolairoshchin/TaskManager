# Load the Rails application.
require_relative "application"

app_env = File.join(Rails.root, 'config', 'env_set.rb')
load(app_env) if File.exist?(app_env)

# Initialize the Rails application.
Rails.application.initialize!
