import { UserLinkWithTooltip } from "@/features/users/components/user-link-with-tooltip";
import Link from "next/link";
import { LinkIt, LinkItUrl } from "react-linkify-it";

interface LinkifyProps {
  children: React.ReactNode;
}

export const Linkify = ({ children }: LinkifyProps) => {
  return (
    <LinkifyUsername>
      <LinkifyHashtag>
        <LinkifyUrl>{children}</LinkifyUrl>
      </LinkifyHashtag>
    </LinkifyUsername>
  );
};

const LinkifyUrl = ({ children }: LinkifyProps) => {
  return (
    <LinkItUrl className="text-primary hover:underline">{children}</LinkItUrl>
  );
};

const LinkifyUsername = ({ children }: LinkifyProps) => {
  return (
    <LinkIt
      regex={/(@[a-zA-Z0-9_-]+)/}
      component={(match, key) => (
        <UserLinkWithTooltip username={match.slice(1)} key={key}>
          {match}
        </UserLinkWithTooltip>
      )}
    >
      {children}
    </LinkIt>
  );
};

const LinkifyHashtag = ({ children }: LinkifyProps) => {
  return (
    <LinkIt
      regex={/(#[a-zA-Z0-9]+)/}
      component={(match, key) => (
        <Link
          key={key}
          href={`/hashtag/${match.slice(1)}`}
          className="text-primary hover:underline"
        >
          {match}
        </Link>
      )}
    >
      {children}
    </LinkIt>
  );
};
