export const projectSelector = {
    Members: {
      select: {
        user: {
          select: {
            user_id: true,
            email: true,
            name: true,
          },
        },
      },
    },
    Tasks: {
      select: {
        task_id: true,
        description: true,
        assigned_to: true,
        name: true,
        created_at: true,
        last_date: true,
        updated_at: true,
        status: true,
        priority: true,
        Transcibtions: true,
        assignees: {
          select: {
            user: {
              select: {
                user_id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    },
  };
  