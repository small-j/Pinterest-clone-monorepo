interface Props {
  name: string;
  email: string;
}

function Profile({ name, email }: Props) {
  return (
    <div className='mt-4 mb-8'>
      <div className="text-sm font-semibold">
        {name === '' ? 'Unknown' : name}
      </div>
      <div className="text-sm">{email}</div>
    </div>
  );
}

export default Profile;
