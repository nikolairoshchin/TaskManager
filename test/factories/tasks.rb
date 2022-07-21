FactoryBot.define do
  factory :task do
    name
    description
#    author_id  { 1 } 
    association :author, factory: :manager
#    assignee_id { 1 }
    association :assignee, factory: :developer 
    state
    expired_at
  end
end
