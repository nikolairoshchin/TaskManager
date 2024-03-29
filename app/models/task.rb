class Task < ApplicationRecord
  belongs_to :author, class_name: 'User'
  belongs_to :assignee, class_name: 'User', optional: true
  has_one_attached :image

  validates :name, presence: true
  validates :description, presence: true
  validates :author, presence: true
  validates :description, length: { maximum: 500 }

  state_machine :state, initial: :new_task do
    event :to_develop do
      transition new_task: :in_development
      transition in_qa: :in_development
    end
    event :to_archive do
      transition new_task: :archived
      transition released: :archived
    end
    event :to_qa do
      transition in_development: :in_qa
      transition in_code_review: :in_qa
    end
    event :to_code_review do
      transition in_qa: :in_code_review
    end
    event :to_ready_for_release do
      transition in_code_review: :ready_for_release
    end
    event :to_release do
      transition ready_for_release: :released
    end
  end
end
