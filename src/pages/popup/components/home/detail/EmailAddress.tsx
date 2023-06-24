function EmailAddress({
  emailAddress,
  isEditing
}: {
  emailAddress: string | null;
  isEditing: boolean;
}) {
  const containerStyle = `border rounded-b-none rounded rounded-tl-lg rounded-tr-lg hover:bg-french-blue/[0.4] ${
    isEditing
      ? 'bg-big-stone border-iron/[0.5]'
      : 'border-big-stone bg-astronaut'
  }`;
  return (
    <div className={containerStyle}>
      <div>
        <div
          className="mt-1 ml-2 text-malibu font-normal text-detailLabel"
          id="emailLabel"
        >
          email
        </div>
        <div className="ml-2 mb-1 font-normal text-white text-detailValue">
          {emailAddress}
        </div>
      </div>
    </div>
  );
}

export default EmailAddress;
