function EmailDomain({ emailDomain }: { emailDomain: string | null }) {
  const domainExists = emailDomain !== null && emailDomain !== '';
  const domainLabelColor = domainExists ? 'text-white' : 'text-gray-400';
  return (
    <div className="bg-astronaut border border-big-stone border-t-0 hover:bg-french-blue/[0.4]">
      <div>
        <div
          className="ml-2 text-malibu font-normal text-detailLabel"
          id="domainLabel"
        >
          domain
        </div>
        <div
          className={`ml-2 font-normal text-detailValue ${domainLabelColor}`}
        >
          {domainExists ? emailDomain : 'No domain set'}
        </div>
      </div>
    </div>
  );
}

export default EmailDomain;
