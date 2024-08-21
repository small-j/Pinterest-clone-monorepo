interface Props {
  name: string;
  email: string;
  marginTop: string;
  marginBottom: string;
}

function Profile({ name, email, marginTop, marginBottom }: Props) {
  return (
    <div className={`mt-${marginTop} mb-${marginBottom}`}>
      <div className="text-sm font-semibold">
        {name === '' ? 'Unknown' : name}
      </div>
      <div className="text-sm">{email}</div>
    </div>
  );
}

export default Profile;
