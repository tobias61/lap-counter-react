import gql from 'graphql-tag';

const query = gql`
  query SponsorList {
    sponsorList {
      total
      sponsors {
        id
        name
        email
        contact_firstName
        contact_lastName
        sponsor_amount
      }
    }
  }
`;

export default query;
