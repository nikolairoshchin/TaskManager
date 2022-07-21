FactoryBot.define do
  factory :task do
    name { "MyString" }
    description { "MyText" }
#   author_id  { 1} 
    association :author, factory: :manager
#    assignee_id { 1 }
    association :assignee, factory: :developer
    state { "MyString" }
    expired_at { "2022-07-20" }
  end
end
