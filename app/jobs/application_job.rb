class ApplicationJob

  include Sidekiq::Worker
  include Sidekiq::Throttled::Worker

  sidekiq_options queue: :mailers
  sidekiq_throttle_as :mailer

end
