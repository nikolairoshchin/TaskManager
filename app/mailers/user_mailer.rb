class UserMailer < ApplicationMailer

  def task_created
    user = params[:user]
    task = params[:task]
    @message = "Task # #{task.id} was created"
    mail(from: 'noreply@taskmanager.com', to: user.email, subject: 'New Task Created', template_name: 'task_template')
  end

  def task_updated
    user = params[:user]
    task = params[:task]
    @message = "Task # #{task.id} was updated"
    mail(from: 'noreply@taskmanager.com', to: user.email, subject: 'Task Updated', template_name: 'task_template')
  end

  def task_deleted
    user = params[:user]
    task = params[:task]
    @message = "Task # #{task.id} was deleted"
    mail(from: 'noreply@taskmanager.com', to: user.email, subject: 'Task Deleted', template_name: 'task_template')
  end

end
