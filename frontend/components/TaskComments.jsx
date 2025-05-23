import React, { useCallback, useEffect, useState } from 'react'
import BigDialog from './Dialogs/BigDialog'
import AvatarCompoment from './AvatarCompoment'
import { useUser } from '@/providers/UserProvider'
import { Button } from './Button'
import { Send } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import moment from 'moment'
import { toast } from 'react-toastify'
import { addTaskCommentsRequest, getTaskCommentsRequest } from '@/lib/http/task'

const TaskComments = ({ open, onClose, task }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);
  const { user } = useUser();

  const handleComment = useCallback(async () => {
    setIsLoading(true)
    try {
      const formdata = {
        content,
        task_id: task.task_id
      }

      const res = await addTaskCommentsRequest(formdata);
      await getComments();
      setContent('');
      toast.success(res?.data?.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    } finally {
      setIsLoading(false)
    }
  }, [content, task]);


  const getComments = useCallback(async () => {
    try {
      const res = await getTaskCommentsRequest(task.task_id);
      setComments(res?.data?.comments);
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message);
    }
  }, []);

  useEffect(() => {
    getComments();
  }, [task]);


  return (
    <BigDialog open={open} onClose={onClose}>
      <div className='h-[30rem] overflow-y-auto space-y-6'>
        {
          comments?.map((comment) => (
            <Card className='cursor-pointer border-none shadow-gray-50' key={comment?.comment_id}>
              <CardContent className='px-4 py-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <AvatarCompoment name={comment?.user?.name} />
                    <h2 className='text-lg font-medium text-gray-700'>{comment?.user?.name}</h2>
                  </div>
                  <time className='font-light text-gray-700 text-sm'>{moment(comment?.created_at).calendar()}</time>
                </div>
                <p className='text-gray-700 font-light leading-6 mt-4 px-2'>
                  {comment?.content}
                </p>
              </CardContent>
            </Card>
          ))
        }
      </div>
      <div className='flex items-center gap-2 py-5'>
        <AvatarCompoment name={user?.name} className='!w-[2.5rem] !h-[2.5rem]' />
        <div className='border-b border-gray-400 flex-1 relative'>
          <input className='w-full placeholder:text-gray-400 outline-none border-none bg-transparent px-2 py-2' placeholder='Write Something...' value={content} onChange={(e) => setContent(e.target.value)} />
        </div>

        <Button className={' text-white bg-blue-500 hover:bg-blue-600 transition-all disabled:opacity-40'} disabled={isLoading || !content} isLoading={isLoading} onClick={handleComment}>
          <Send />
        </Button>
      </div>
    </BigDialog>
  )
}

export default TaskComments