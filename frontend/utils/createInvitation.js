export function generateInvitation(inviteLink, projectName, userName, userRole, invitedRole, isClient) {
  if (isClient) {
    return `
      We are excited to keep you informed about the progress of your project, "${projectName}". Our team is dedicated to delivering the best results, and we want to ensure you have full visibility into the latest updates.
      You can track the project's status and key developments by clicking the link below:
      ${inviteLink}?role=client
      We appreciate your trust in us and look forward to keeping you informed every step of the way.
      Best regards,
      ${userName}
      ${userRole}
    `;
  }
  return `

      You are invited to collaborate on the project "${projectName}"!
  
      We believe your skills and experience will be a valuable addition to the team. As a ${invitedRole}, you will play a key role in contributing to the success of the project.
  
      To join, please click the link below to accept the invitation:
      ${inviteLink}?role=team
  
      We look forward to working with you!
  
      Best regards,
      ${userName}
      ${userRole}
    `;
}