if ENV["COVERAGE"]
  require 'simplecov'
  require 'coveralls'

  if ENV["CI"] || ENV["COVERAGE_LCOV"]
    SimpleCov.formatters = [
      SimpleCov::Formatter::HTMLFormatter,
      Coveralls::SimpleCov::Formatter
    ]
  end
  SimpleCov.start
end

ENV['RAILS_ENV'] ||= 'test'
require_relative '../config/environment'
require 'rails/test_help'
require 'sidekiq/testing'

class ActiveSupport::TestCase
  include ActionMailer::TestHelper
  # Run tests in parallel with specified workers
  parallelize(workers: :number_of_processors)

  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...
  include FactoryBot::Syntax::Methods
  include AuthHelper
end
