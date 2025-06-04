import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "./catchAsyncError.js";
import jwt from "jsonwebtoken";
import {prisma} from "../prisma/index.js";

export const authMiddleware = catchAsyncError(async (req,res,next) => {
    const token = req.cookies.token;
    if(!token) throw new ErrorHandler('Unauthorize user',401);
    const decodeToken = jwt.verify(token,process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
        where: {
          user_id: decodeToken.user_id, // Replace with your token decoding logic
        },
        select: {
          user_id: true,
          name: true,
          email: true,
          bring: true,
          hear_about_as: true,
          focus: true,
          account_name: true,
          Role: true,
          connect_mail_hash: true,
          Projects: {
            select: {
              project_id: true,
              name: true,
              description: true,
              created_at: true,
              updated_at: true,
              created_by: true,
              Tasks: {
                select: {
                  task_id: true,
                  name: true
                }
              },
              Clients: {
                select: {
                  project_client_id: true,
                  user: {
                    select: {
                      name: true,
                      email: true,
                      user_id: true
                    }
                  }
                }
              },

              Members: {
                select: {
                  project_member_id: true,
                  user: {
                    select: {
                      name: true,
                      email: true,
                      user_id: true
                    }
                  }
                }
              },
            },
          },
          Collaboration: {
            select: {
              project_member_id: true,
              role: true,
              added_at: true,
              project: {
                select: {
                  project_id: true,
                  name: true,
                  description: true,
                  Tasks: {
                    select: {
                      task_id: true,
                      name: true
                    }
                  },
                  Clients: {
                    select: {
                      project_client_id: true,
                      user: {
                        select: {
                          name: true,
                          email: true,
                          user_id: true
                        }
                      }
                    }
                  },

                  Members: {
                    select: {
                      project_member_id: true,
                      user: {
                        select: {
                          name: true,
                          email: true,
                          user_id: true
                        }
                      }
                    }
                  },
                },
              
              },
            },
          },
          Services: {
            select: {
              project_client_id: true,
              added_at: true,
              project: {
                select: {
                  project_id: true,
                  name: true,
                  description: true,
                  Tasks: {
                    select: {
                      task_id: true,
                      name: true
                    }
                  },
                  Clients: {
                    select: {
                      project_client_id: true,
                      user: {
                        select: {
                          name: true,
                          email: true,
                          user_id: true
                        }
                      }
                    }
                  },

                  Members: {
                    select: {
                      project_member_id: true,
                      user: {
                        select: {
                          name: true,
                          email: true,
                          user_id: true
                        }
                      }
                    }
                  },
                  
                },
              },
            },
          },
          Time: {
            where: {
              status: "PROCESSING"
            },
            select: {
              task_id: true,
              start: true,
              status: true,
              end: true,
              time_id: true
            }
          }
        },
    });


    if(!user) throw new ErrorHandler('Unauthorize user',401);


    const projectIds = user.Projects.map(project => project.project_id);

    let CollaborationProject = user.Collaboration.map((project) => ({is_collabration_project: true,...project.project}));
    CollaborationProject = CollaborationProject.filter(project => !projectIds.includes(project.project_id));


    let ClientProject = user.Services.map((project) => ({is_clinet_project: true,...project.project}));
    ClientProject = ClientProject.filter(project => !projectIds.includes(project.project_id));

    user.Projects = [...user.Projects,...CollaborationProject,...ClientProject];

    req.user = user;
  
    next()
});