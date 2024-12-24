export function generateInvitation(inviteLink, projectName, userName, userRole, invitedRole) {
    return `
      Hi [user name],
  
      You are invited to collaborate on the project "${projectName}"!
  
      We believe your skills and experience will be a valuable addition to the team. As a ${invitedRole}, you will play a key role in contributing to the success of the project.
  
      To join, please click the link below to accept the invitation:
      ${inviteLink}
  
      We look forward to working with you!
  
      Best regards,
      ${userName}
      ${userRole}
    `;
  }