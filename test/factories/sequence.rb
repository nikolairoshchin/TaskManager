FactoryBot.define do
  sequence :string, aliases: [:first_name, :last_name, :password, :name, :description] do |n|
    "string#{n}"
  end

  sequence :email do |n|
    "person#{n}@example.com"
  end

  sequence :state, %i[new_task, in_development, archived, in_qa, in_code_review, ready_for_release, released].cycle

  sequence :expired_at do |n| 
    Date.today + n.day
  end
end
