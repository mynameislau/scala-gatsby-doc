import React from 'react'
import { Link } from 'react-router'
import Breakpoint from '../../components/Breakpoint'
import find from 'lodash/find'
import { prefixLink } from 'gatsby-helpers'
import { config } from 'config'
import R from 'ramda';

import typography from 'utils/typography'
const { rhythm } = typography

module.exports = React.createClass({
  propTypes () {
    return {
      route: React.PropTypes.object,
    }
  },
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },
  handleTopicChange (e) {
    return this.context.router.push(e.target.value)
  },

  render () {

    const log = val => {
      console.log('log:', val);
      return val;
    };

    const flattenPages = R.reduce((acc, val) => {
      const flatChildren = val.children ? flattenPages(val.children) : [];
      return R.concat(acc, [val, ...flatChildren]);
    }, []);

    const getPage = ({ root, children, title }) => {
      const page = find(this.props.route.pages, (_p) => _p.path === root)
      console.log(this.props.route);
      return {
        title: title ? title : page.data.title,
        path: page ? page.path : null,
        children: children ? R.map(getPage, children) : null
      }
    };

    const getDocOption = (child) =>
      <option
        key={prefixLink(child.path)}
        value={prefixLink(child.path)}
      >
        {child.title}
      </option>;

    const getListEntry = (child) => {
      const isActive = prefixLink(child.path) === this.props.location.pathname
      return (
        <li
          key={child.path}
          style={{
            marginBottom: rhythm(1/2),
          }}
        >
          <Link
            to={prefixLink(child.path)}
            style={{
              textDecoration: 'none',
            }}
          >
            {isActive ? <strong>{child.title}</strong> : child.title}
          </Link>
          {child.children ? getList(child.children) : ''}
        </li>
      )
    };

    //const getDocPages = R.map(R.compose(getListEntry, getPage));
    const getDocOptions = R.compose(
      R.map(getDocOption),
      R.map(getPage),
      flattenPages
    );

    const getList = (list) => <ul
      style={{
        listStyle: 'none',
        marginTop: rhythm(1/2),
      }}
    >
      {R.map(getListEntry, list)}
    </ul>

    return (
      <div>
        <Breakpoint
          mobile
        >
          <div
            className="sidebar"
            style={{
              overflowY: 'auto',
              paddingRight: `calc(${rhythm(1/2)} - 1px)`,
              position: 'absolute',
              width: `calc(${rhythm(8)} - 1px)`,
              borderRight: '1px solid lightgrey',
            }}
          >
          {R.compose(getList, R.map(getPage))(config.docPages)}
          </div>
          <div
            style={{
              padding: `0 ${rhythm(1)}`,
              paddingLeft: `calc(${rhythm(8)} + ${rhythm(1)})`,
            }}
          >
            {this.props.children}
          </div>
        </Breakpoint>
        <Breakpoint>
          <strong>Topics:</strong>
          {' '}
          <select
            defaultValue={this.props.location.pathname}
            onChange={this.handleTopicChange}
          >
            {getDocOptions(config.docPages)}
          </select>
          <br />
          <br />
          {this.props.children}
        </Breakpoint>
      </div>
    )
  },
})
