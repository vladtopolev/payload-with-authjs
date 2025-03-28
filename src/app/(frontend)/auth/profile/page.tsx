import { auth, signOut } from '@/auth'

const Page = async () => {
  const session = await auth()
  return (
    <div className="p-4">
      <button
        onClick={async () => {
          'use server'
          await signOut()
        }}
        className="bg-white hover:bg-amber-50 text-black  py-1 px-2 rounded"
      >
        LogOut
      </button>
      <pre className="pt-2">{JSON.stringify(session, null, 2)}</pre>
    </div>
  )
}

export default Page
