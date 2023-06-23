function EmailAddress({ emailAddress }: { emailAddress: string | null }) {
  return (
    <div className="bg-astronaut border border-big-stone rounded-b-none rounded rounded-tl-lg rounded-tr-lg hover:bg-french-blue/[0.4]">
      <div>
        <div
          className="mt-1 ml-2 text-malibu font-normal text-detailLabel"
          id="emailLabel"
        >
          email
        </div>
        <div className="ml-2 font-normal text-white text-detailValue">
          {emailAddress}
        </div>
      </div>
    </div>
  );
}

export default EmailAddress;
